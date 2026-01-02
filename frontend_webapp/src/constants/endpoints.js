
export const FILE_ENDPOINT = "http://127.0.0.1:8000";
const baseEndpoint = "http://127.0.0.1:8000/api/v1/";
const accEndpoint = baseEndpoint + "acc/";

export const REGISTER_ENDPOINT = accEndpoint + "register/";
export const LOGIN_ENDPOINT = accEndpoint + "token/";
export const REFRESH_ENDPOINT = accEndpoint + "token/refresh/";
export const LOGOUT_ENDPOINT = accEndpoint + "logout/";

const generateEndpoint = baseEndpoint + "generateStudy/"
export const GENERATE_ENDPOINT = generateEndpoint + "generate/";
export const TOPICS_ENDPOINT = generateEndpoint + "topics/";
export const LATESTS_ENDPOINT = generateEndpoint + "latestGroups/";
export const PUBLIC_GROUP_ENDPOINT = generateEndpoint + "publicGroup/";
export const PRIVATE_GROUP_ENDPOINT = generateEndpoint + "privateGroup/";
export const GET_CONFIGS_ENDPOINT = generateEndpoint + "getConfigs/";

const groupEndpoint = baseEndpoint + "studyGroup/"
export const UP_DOWN_VOTE_ENDPOINT = groupEndpoint + "studyVote/";
export const LIST_MY_VOTED_ENDPOINT = groupEndpoint + "listMyVotedGroups/";
