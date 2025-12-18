
from .llms import LLMs,ValidationStructure
from langgraph.graph import StateGraph,MessagesState
from langchain_core.messages import SystemMessage,AIMessage
from langgraph.types import Command
from typing import Literal


class PlanState(MessagesState):
    structured_plan: ValidationStructure

class PlanGenerator:
    def __init__(self,llms:LLMs,use_validation = True, max_iterations = 3):
        
        self.llms = llms
        self.max_iterations = max_iterations
        self.n_iteration = 0

        graph = StateGraph(PlanState)
        graph.add_node("generate_plan_node",self.generate_plan_node)

        graph.set_entry_point("generate_plan_node")

        if use_validation: 
            graph.add_node("validate_plan_node",self.validate_plan_node)
            graph.add_edge("generate_plan_node","validate_plan_node")


        self.graph = graph.compile()


    def generate_plan_node(self,state:PlanState):
        msgs = [
            SystemMessage(
                (
                "You are a study plan generator. You must answer a list of study topics in chronological order. "
                "One topic should cover the dependecies of the consecutive topic offering a smooth learning journey "
                "until it covers all the content."
                )
            ),
            *state['messages']
        ]
        res = self.llms.plan_llm.invoke(msgs)
        plan_msg = AIMessage( "\n".join(res.study_plan) )
        return {"messages":plan_msg,"structured_plan":res}


    def validate_plan_node(self,state:PlanState) -> Command[Literal['generate_plan_node',"__end__"]]:
        msgs = [
            SystemMessage(
                (
                "You are a study plan generator. You must answer a list of study topics in chronological order. "
                "One topic should cover the dependecies of the consecutive topic offering a smooth learning journey "
                "until it covers all the content."
                )
            ),
            *state['messages']
        ]

        res = self.llms.plan_val_llm.invoke(msgs)

        self.n_iteration += 1

        if res.is_valid == "no" and self.n_iteration < self.max_iterations:
            return Command(goto="generate_plan_node",update={"messages":AIMessage( res.msg )})
        else:
            return Command(goto="__end__",update={"messages":AIMessage( res.is_valid )})
        

    def invoke(self,user_input):
        res = self.graph.invoke( {"messages":[user_input]} )
        success = res['messages'][-1].content != 'no'
        return res,success
    
    def debug_graph(self,user_input):

        for chunk in self.graph.stream( {"messages":[user_input]},stream_mode='' ):
            print(chunk)