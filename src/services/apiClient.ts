import axios from "axios";
import { CreateOrJoinSpaceRequest, StartSessionRequest } from "models/requests";
import {
  CreateOrJoinSpaceResponse,
  QuestionTypeResponse,
} from "models/responses";

const { REACT_APP_BASE_API, REACT_APP_APPLICATION_TOKEN } = process.env;

export const apiClient = axios.create({
  baseURL: REACT_APP_BASE_API,
  headers: { applicationToken: REACT_APP_APPLICATION_TOKEN! },
});

export const createSpace = async ({
  name,
  amandaId,
  color,
}: CreateOrJoinSpaceRequest) => {
  const { data } = await apiClient.post("space/create-or-join", {
    token: amandaId,
    name,
    color,
  });
  return data as CreateOrJoinSpaceResponse;
};

export const updateSpace = async (spaceId: number, name: string) => {
  const { data } = await apiClient.put(`space/${spaceId}`, {
    name,
  });
  return data;
};

export const getQuestionTypes = async () => {
  const { data } = await apiClient.get(`category`);
  return data as QuestionTypeResponse[];
};

export const startSession = async ({
  spaceId,
  userId,
  questionTypeId,
}: StartSessionRequest) => {
  const { data } = await apiClient.post(
    `space/${spaceId}/user/${userId}/start-session`,
    {
      questionTypeId: questionTypeId || 1,
    }
  );
  return data;
};

export const getNextQuestion = async (sessionId: number) => {
  const { data } = await apiClient.get(`session/${sessionId}/next-question`);
  return data;
};

export const answerQuestion = async (
  sessionId: number,
  userId: number,
  questionId: number,
  chosenUserId: number
) => {
  const { data } = await apiClient.post(
    `session/${sessionId}/user/${userId}/answer`,
    {
      questionId,
      chosenUserId,
    }
  );
  return data;
};

export const getQuestionResult = async (
  sessionId: number,
  questionId: number
) => {
  const { data } = await apiClient.get(
    `session/${sessionId}/question/${questionId}/result`
  );
  return data;
};

export const endGame = async (sessionId: number) => {
  const { data } = await apiClient.get(`session/${sessionId}/summarize`);
  return data;
};

/*
### CREATE space or Join existing one: 
# Iot topic - `${amanda.channel}-add-user`
# PubNub topic - `${amanda.channel}-add-user`
# PubNub body - `{data:{user: { id: 17, name: 'ofer', color: '200,100,40' }}}`
# REST response - space, users,user (So the user will know the space status and his id)
POST http://localhost:3030/space/create-or-join HTTP/1.1
content-type: application/json

{
    "token":123,
    "name":"ofer",
    "color":"70,20,140"
}

### UPDATE space (Change space name), simple REST call
# PubNub topic - `${amanda.channel}-update`
# PubNub body - `{data:{space: {  name: 'Test2' }}}`
PUT http://localhost:3030/space/1 HTTP/1.1
content-type: application/json

{
    "name":"Test2"
}

### START new session: (new game round)
# PubNub topic - `${amanda.channel}-start-session`
# PubNub body - `{data:{session: { id: 9 } }}}`

POST http://localhost:3030/space/1/start-session HTTP/1.1
content-type: application/json

{
    "roundNumber":2
}

### Ask server to send the next question to everyone: (will send the question through pubnub)
# PubNub topic - `${amanda.channel}-next-question`
# PubNub body - `{data:{question: { id: 2, content: 'Who is the fucking best?' }}}`
GET http://localhost:3030/session/9/next-question HTTP/1.1
content-type: application/json


### Answer question: (Specific user in a specific session choosing a specific user), simple REST call
POST http://localhost:3030/session/5/user/17/answer HTTP/1.1
content-type: application/json

{
  "questionId":2,
  "chosenUserId":18
}

### Ask for the question results: (will send the results through pubnub)
# IoT topic - `${amanda.channel}-select-tie` || `${amanda.channel}-select`
# PubNub topic - `${amanda.channel}-next-result`
# PubNub body - `data:{ users:[ { id: 17, count: 5, name: 'ofer', color: '200,100,40'} } ]`
GET http://localhost:3030/session/5/question/2/result HTTP/1.1
content-type: application/json

{
}

### Ask for the session results: (will send the results through pubnub)
# PubNub topic - `${amanda.channel}-session-summary`
# PubNub body - `users: [ { id: 17, count: 5, name: 'ofer', color: '200,100,40' } ]`

GET http://localhost:3030/session/5/summarize HTTP/1.1
content-type: application/json
*/
