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

export const leaveSpace = async (userId: number) => {
  const { data } = await apiClient.post(`user/${userId}/leave`);
  return data;
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

export const returnToOptions = async (spaceId: number) => {
  const { data } = await apiClient.post(`space/${spaceId}/return-to-options`);
  return data;
};
