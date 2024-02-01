import QuestionCard from "./QuestionCard";
import CircularProgress from "components/ui/CircularProgress";

type props = {
  question?: string;
};
const LoaderCard = ({ question }: props) => {
  return (
    <div className="h-full w-full flex flex-col">
      <QuestionCard question={question || "כבר מתחילים את הערב"} />
      <CircularProgress wrapperClassName="my-auto" className="h-12 w-12" />
    </div>
  );
};

export default LoaderCard;
