

from .content_generator import ContentGenerator
from .plan_generator import PlanGenerator
from .llms import LLMs
from typing import TypedDict,Literal
from langgraph.types import Command
from langgraph.graph import StateGraph 

class StudyState(TypedDict):
    user_input:str
    study_plan:list[str]
    study_content:list[str]

class StudyGeneration:

    def __init__(self,llms:LLMs, use_validation: bool = True, max_iterations: int = 3):
        self.llms = llms
        self.use_validation = use_validation
        self.max_iterations = max_iterations

        graph = StateGraph(StudyState)
        graph.add_node("generate_plan_node",self.generate_plan_node)
        graph.add_node("generate_content_node",self.generate_content_node)

        graph.set_entry_point("generate_plan_node")

        self.graph = graph.compile()


    def generate_plan_node(self,state:StudyState) -> Command[Literal["__end__","generate_content_node"]]:

        plan_generator = PlanGenerator(self.llms,self.use_validation,self.max_iterations)
        res = plan_generator.invoke(user_input=state['user_input'])

        goto = "__end__"
        plan = None

        if res[1]:
            goto = "generate_content_node"
            plan = res[0]['structured_plan'].study_plan[:2] #get only two for quick generation/testing....
        
        return Command(goto=goto, update={"study_plan":plan})
    
    def generate_content_node(self,state:StudyState):

        content_gen = ContentGenerator(self.llms)
        res = content_gen.invoke(study_plan=state['study_plan'],user_input=state['user_input'])

        return {"study_content":res['topic_content']}

    def invoke(self,user_input):
        res = self.graph.invoke({"user_input":user_input})
        return {
            "study_plan":res["study_plan"],
            "study_content":res["study_content"]
        }


