import React from "react";
import { motion } from "framer-motion";
import logo from "assets/amanda_logo.png";
import GradientButton from "components/ui/GradientButton";
import { Sparkles } from "lucide-react";
import Footer from "components/header/Footer";
import { Step } from "models/welcome";

type WelcomeSectionProps = {
  handleWelcomePageClick: (step: Step) => void;
};
const WelcomeSection = ({ handleWelcomePageClick }: WelcomeSectionProps) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full max-w-md flex flex-col items-center text-center"
    >
      <div className="flex-1 flex flex-col items-center w-full my-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants}>
            <img src={logo} alt="Amanda Logo" className="w-24 h-24 mx-auto" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Amanda
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white/80 font-light"
          >
            <em>Light up the night</em>
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-white/70 mt-2"
            dir="rtl"
          >
            המשחק האולטימטיבי של "מי הכי סביר ש..." שישדרג כל מסיבה, יצחיק בלי
            סוף, יפתיע את כולם – וייצור רגעים שייזכרו לכל החיים!
          </motion.p>
        </motion.div>

        <div className="my-auto">
          <GradientButton
            onClick={() => handleWelcomePageClick("join")}
            variant="primary"
            className="w-full text-lg py-6"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            הצטרפו למשחק
          </GradientButton>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default WelcomeSection;
