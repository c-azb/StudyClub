
from enum import Enum
from .llms import Sources

class ContentEnum(Enum):
    Basics = 0
    Mediun = 1
    Advanced = 2

class LearnSpeedEnum(Enum):
    Fast = 0
    Slow = 1
    Balanced = 2

class AIComplexityEnum(Enum):
    Simple = 0
    Medium = 1
    Advanced = 2

school_level_options = ("primary","middle school","high school","bachelor's","specialist","master's","doctoral")

def create_user_input(request_data):
    subject = request_data.get('subject')
    contentLayer = ContentEnum( request_data.get('contentLayer') )
    schoolLevel = request_data.get('schoolLevel').replace("school","").strip()
    startPoint = request_data.get('startPoint')
    learnSpeed = LearnSpeedEnum( request_data.get('learnSpeed') )
    #aiComplexity = request_data.get('aiComplexity')

    start_point_msg = get_starting_point_msg(startPoint)
    layer_msg = get_layer_msg(contentLayer)
    learn_speed_msg = get_learn_speed_msg(learnSpeed)

    return (
        f"Generate a study program for the subjects: {subject}\n"
        f"{start_point_msg}\n"
        f"{layer_msg}\n"
        f"{learn_speed_msg}\n"
        f"The study program is for {schoolLevel} school level."   
    )

def get_learn_speed_msg(learnSpeed):
    if learnSpeed == LearnSpeedEnum.Fast:
        return (
            "Explanations must be more direct and straight to the point, with one simple example when needed, "
            "and do not repeat information."
        )
    elif learnSpeed == LearnSpeedEnum.Slow:
        return (
            "Explanations must be more enrolled with different examples and you can constatly recapitulate points already "
            "said previously when apropriate."
        )
    elif learnSpeed == LearnSpeedEnum.Balanced:
        return (
            "Explanations must be more straight to the point whith one or two examples and eventually you can recapitulate " \
            "past explanations when apropriate but avoid too much repetition."
        )
    return ""


def get_starting_point_msg(startPoint):
    if len(startPoint) > 0:
        return (
            f"The user already know the following topics (so do not repeat them, instead use it as a starting point): {startPoint}"
        )
    else: 
        return "Explain from scratch."

def get_layer_msg(contentLayer):
    if contentLayer == ContentEnum.Basics:
        return "Must be a basic superficial explanation."
    elif contentLayer == ContentEnum.Mediun:
        return "Must be a superficial explanation but adding more detailes on topics with more relevance."
    else:
        return "Must be a detailed explanation."
    

def get_ai_complexity_setups(ai_complexity):
    temp = 0.6
    ai_complexity = AIComplexityEnum( ai_complexity )

    if ai_complexity == AIComplexityEnum.Advanced:
        use_validation=True
        max_iterations=3
        plan_llm=("qwen3:8b",Sources.OLLAMA,temp,False)
        plan_val_llm=("qwen3:8b",Sources.OLLAMA,temp,True)
        content_llm=("qwen3:8b",Sources.OLLAMA,temp,False)
    elif ai_complexity == AIComplexityEnum.Medium:
        use_validation=False
        max_iterations=1
        plan_llm=("qwen3:8b",Sources.OLLAMA,temp,False)
        plan_val_llm=("llama3.2:3b",Sources.OLLAMA,temp,False)
        content_llm=("qwen3:8b",Sources.OLLAMA,temp,False)
    else:#if ai_complexity == AIComplexityEnum.Simple:
        use_validation=False
        max_iterations=1
        plan_llm=("llama3.2:3b",Sources.OLLAMA,temp,False)
        plan_val_llm=(None,Sources.NONE,None,None)
        content_llm=("llama3.2:3b",Sources.OLLAMA,temp,False)
    
    return {
        "use_validation":use_validation,
        "max_iterations":max_iterations,
        "plan_llm":plan_llm,
        "plan_val_llm":plan_val_llm,
        "content_llm":content_llm,
    }