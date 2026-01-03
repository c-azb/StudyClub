
Study Club
--

Website that uses AI to generate study topics and their respective content based on the user preferences.

Public study plans can be displayed to others so users can share their study content.

Backend
--

- Django Rest Framework
- SQLite Database
- Langchain/Langgraph
- AI Agents
- OAuth2 authentication

**Packages**

1. [accounts](https://github.com/c-azb/StudyClub/tree/main/backend_app/djangorestapi/accounts): Handles authentication.
2. [api](https://github.com/c-azb/StudyClub/tree/main/backend_app/djangorestapi/api): Handles api verions.
3. [djangorestapi](https://github.com/c-azb/StudyClub/tree/main/backend_app/djangorestapi/djangorestapi): Main django app.
4. [StudyGeneration](https://github.com/c-azb/StudyClub/tree/main/backend_app/djangorestapi/StudyGeneration): Handles the study programs data by generating new study programs, retrieving and deleting.
5. [src](https://github.com/c-azb/StudyClub/tree/main/backend_app/djangorestapi/StudyGeneration/src): Implements the AI system responsible to generate the study plan and content. It also creates custom prompts based on the user preferences.
5. [StudyGroup](https://github.com/c-azb/StudyClub/tree/main/backend_app/djangorestapi/StudyGroup): Implements up/down votes system


Frontend
--

- React.js Framework application
