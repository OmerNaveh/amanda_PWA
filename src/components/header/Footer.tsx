import React from "react";
import { motion } from "framer-motion";
import { ReactComponent as TikTok } from "assets/TikTok.svg";
import { ReactComponent as Youtube } from "assets/YouTube.svg";
import { ReactComponent as Instagram } from "assets/Instagram.svg";

const Footer = () => {
  return (
    <motion.footer
      className="mt-auto text-center flex flex-col gap-2 w-full text-white/70"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-sm">{"עקבו אחרינו והצטרפו לטירוף"}</p>
      <div className="flex justify-center gap-2 items-center">
        <a
          href="https://www.instagram.com/cheerswithamanda/"
          target="_blank"
          rel="noreferrer"
          className="h-8 w-8 cursor-pointer active:opacity-50 transition-transform hover:scale-110"
        >
          <TikTok className="h-8 w-8 [&>path]:fill-white/70" />
        </a>
        <a
          href="https://www.instagram.com/cheerswithamanda/"
          target="_blank"
          rel="noreferrer"
          className="h-8 w-8 cursor-pointer active:opacity-50 transition-transform hover:scale-110"
        >
          <Instagram className="h-8 w-8 [&>path]:fill-white/70" />
        </a>
        <a
          href="https://www.instagram.com/cheerswithamanda/"
          target="_blank"
          rel="noreferrer"
          className="h-8 w-8 cursor-pointer active:opacity-50 transition-transform hover:scale-110"
        >
          <Youtube className="h-8 w-8 [&>path]:fill-white/70" />
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;
