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

export const getQuestionTypes = async () => {
  const { data } = await apiClient.get(`question-type`);
  return data as QuestionTypeResponse;
};

export const startSession = async ({
  spaceId,
  userId,
  questionTypeId,
}: StartSessionRequest) => {
  const { data } = await apiClient.post(`session`, {
    adminId: userId,
    spaceId,
    categoryId: questionTypeId || 1,
  });
  return data;
};

export const getNextQuestion = async (sessionId: number) => {
  const { data } = await apiClient.post(`session/${sessionId}/next-question`);
  return data;
};

export const answerQuestion = async (
  sessionId: number,
  userId: number,
  questionId: number,
  chosenUserId: number
) => {
  const { data } = await apiClient.post(`session/${sessionId}/answer`, {
    questionId,
    chosenUserId,
    userId,
  });
  return data;
};

export const getQuestionResult = async (
  sessionId: number,
  questionId: number
) => {
  const { data } = await apiClient.post(
    `session/${sessionId}/question/${questionId}/result`
  );
  return data;
};

export const endGame = async (sessionId: number) => {
  const { data } = await apiClient.post(`session/${sessionId}/summary`);
  return data;
};

export const returnToOptions = async (spaceId: number) => {
  const { data } = await apiClient.post(`space/${spaceId}/return-to-options`);
  return data;
};
