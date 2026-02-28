"use client";

import { motion } from "framer-motion";

import ExpectedLoss from "@/public/assets/ExpectedLoss.svg";
import Obligo from "@/public/assets/obligus.svg";
import { CustomImage } from "../ui/custom-image";

const ChartSlide = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-8 py-12 h-full">
      {/* Chart Card */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CustomImage priority src={ExpectedLoss} style="w-[432px] h-[268px]" />
        </motion.div>

        {/* Circular Progress */}
        <div className="absolute top-25 left-1/2">
          <motion.div
            style={{ width: "200px", height: "200px" }}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <CustomImage src={Obligo} style="w-[192px] h-[192px]" />
          </motion.div>
        </div>
      </div>

      {/* Text */}
      <motion.div
        className="text-center max-w-md mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 className="text-lg md:text-xl font-medium text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-300 text-sm">{subtitle}</p>
      </motion.div>
    </div>
  );
};

export default ChartSlide;
