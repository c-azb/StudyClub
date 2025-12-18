

from langchain_ollama import ChatOllama
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from enum import Enum
from pydantic import BaseModel,Field
from typing import Literal,Optional

class Sources(Enum):
    OLLAMA = 1
    NONE = 99

def get_llm(model,source:Sources,temperature,reasoning):
    if source == Sources.OLLAMA:
        return ChatOllama(model=model,base_url='localhost:11434',temperature=temperature,reasoning=reasoning)

    return None


class LLMs:
    def __init__(self,plan_llm:BaseChatModel,plan_val_llm:BaseChatModel,content_llm:BaseChatModel):
        self.plan_llm = plan_llm.with_structured_output(PlanStructure)
        if plan_val_llm: 
            self.plan_val_llm = plan_val_llm.with_structured_output(ValidationStructure)
        self.content_llm = content_llm



class PlanStructure(BaseModel):
    study_plan:list[str] = Field(description="List of the study plan ordered from the begining to the end of the study process.")

class ValidationStructure(BaseModel):
    is_valid:Literal['yes','no'] = Field(description="Answer yes if valid or no if not valid")
    msg:Optional[str] | None = Field(description="If is not valid, provide a message of what is wrong and what could be done to fix it.")


