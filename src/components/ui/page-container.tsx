
import { AnimatePresence, motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`max-w-screen-xl mx-auto px-4 py-6 pb-24 md:py-8 md:pb-8 ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContainer;
