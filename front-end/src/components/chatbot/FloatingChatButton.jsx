import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import robot from "../../assets/chatbot/robot.png";

export default function FloatingChatButton({ onClick }) {

  const [showRobot, setShowRobot] = useState(false);

  useEffect(() => {

    const interval = setInterval(() => {

      setShowRobot(true);

      setTimeout(() => {
        setShowRobot(false);
      }, 6000);

    }, 12000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="fixed bottom-14 right-6 z-[9999] flex flex-col items-end">

      {/* ROBOT POPUP */}

      <AnimatePresence>
        {showRobot && (

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: -20, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex flex-col items-center"
          >

            {/* Floating Robot */}

            <motion.img
              src={robot}
              alt="Robot assistant"
              className="
              w-40
              h-40
              drop-shadow-2xl
              "
              animate={{
                y: [0, -90, 0],
                rotate: [0, 8, -8, 5, -5, 0]
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 2
                },
                rotate: {
                  repeat: Infinity,
                  duration: 1.5
                }
              }}
            />

            {/* Speech Bubble */}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="
              mt-3
              bg-white
              px-5 py-2
              rounded-full
              shadow-xl
              text-sm
              font-semibold
              "
            >
              Hi! I'm BoardMate 🤖
            </motion.div>

          </motion.div>

        )}
      </AnimatePresence>


      {/* CHAT BUTTON */}

      <motion.button
        onClick={onClick}

        whileHover={{
          scale: 1.15
        }}

        whileTap={{
          scale: 0.9
        }}

        className="
        relative
        w-16
        h-16
        rounded-full
        bg-gradient-to-r
        from-blue-500
        to-indigo-600
        text-white
        shadow-2xl
        flex items-center justify-center
        text-2xl
        overflow-hidden
        "
      >

        {/* Glow pulse */}

        <span
          className="
          absolute
          inset-0
          rounded-full
          bg-white/30
          blur-xl
          animate-pulse
          "
        />

        💬

      </motion.button>

    </div>
  );
}