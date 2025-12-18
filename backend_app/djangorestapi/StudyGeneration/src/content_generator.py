

from langgraph.graph import MessagesState,StateGraph,START,END
from langchain_core.messages import SystemMessage,AIMessage,HumanMessage
from typing import TypedDict
from .llms import LLMs

class ContentGenState(TypedDict):
    study_plan:list[str]
    curruent_topic:int
    topic_content:list[str]
    user_input:str

class ContentGenerator:

    def __init__(self,llms:LLMs):
        self.llms = llms

        graph = StateGraph(ContentGenState)
        graph.add_node("generate_content_node",self.generate_content_node)
        graph.add_conditional_edges(START,self.check_generation,
                                    {"__end__":END,
                                     "generate_content_node":"generate_content_node"})
        
        graph.add_conditional_edges("generate_content_node",self.check_generation,
                                    {"__end__":END,
                                     "generate_content_node":"generate_content_node"})

        self.graph = graph.compile()        


    def generate_content_node(self, state:ContentGenState):

        topic_id = state["curruent_topic"]
        topic = state["study_plan"][topic_id]
        previous_topic = []
        topic_content = state["topic_content"].copy()

        if topic_id > 0:
            previous_topic = [
                AIMessage(state["study_plan"][topic_id-1] + "\n" + state["topic_content"][topic_id-1])
            ]

        msgs = [
            SystemMessage("Based on the previous topic generate the new topic content"),
            HumanMessage(state["user_input"]),
            *previous_topic,
            HumanMessage(f"Provide an explanation for the topic: {topic}")
        ]

        res = self.llms.content_llm.invoke(msgs).content

        print(topic_id)

        return {
            "curruent_topic":topic_id+1,
            "topic_content": topic_content + [res]
        }

    def check_generation(self,state:ContentGenState):
        if state["curruent_topic"] >= len(state["study_plan"]):
            return "__end__"
        return "generate_content_node"
    
    def invoke(self,study_plan,user_input):
        res = self.graph.invoke(
            {"study_plan":study_plan,
             "curruent_topic":0,
             "topic_content":[],
             "user_input":user_input}
             )
        
        return res