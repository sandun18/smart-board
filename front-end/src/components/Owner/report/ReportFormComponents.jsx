import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Sub-Component: Select Field ---
export const SelectGroup = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  disabled,
  placeholder,
}) => (
  <div className="form-group">
    <label
      htmlFor={id}
      className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary"
    >
      {label} *
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className="
        w-full p-3.5 px-4 rounded-xl text-sm transition-all duration-300
        bg-white text-text border border-light appearance-none
        focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20
        disabled:bg-light/30 disabled:cursor-not-allowed disabled:text-muted
      "
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.id || opt} value={opt.id || opt}>
          {opt.name || opt}
        </option>
      ))}
    </select>
  </div>
);

// --- Sub-Component: Evidence Uploader ---
export const EvidenceUpload = ({ onFileChange, files, onRemoveFile }) => {
  return (
    <div className="mt-8">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-primary">
        Attach Photos or Documents
      </label>

      {/* 1. The Dropzone/Upload Area */}
      <motion.div
        whileHover={{
          scale: 1.01,
          backgroundColor: "#fafafa",
          borderColor: "#FF7A00",
        }}
        whileTap={{ scale: 0.99 }}
        className="p-8 text-center transition-colors duration-300 border-2 border-dashed cursor-pointer  rounded-report bg-card-bg border-light group"
        onClick={() => document.getElementById("fileUpload").click()}
      >
        <i className="mb-3 text-3xl transition-transform fas fa-file-upload text-accent group-hover:scale-110 group-hover:-translate-y-1"></i>
        <p className="text-xs font-medium text-muted">
          Drag and drop evidence files here, or{" "}
          <span className="font-bold text-accent group-hover:underline">
            browse
          </span>
        </p>
        <input
          type="file"
          id="fileUpload"
          hidden
          multiple
          accept="image/*, application/pdf"
          onChange={onFileChange}
        />
      </motion.div>

      {/* 2. File Preview Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-3 md:grid-cols-4">
        <AnimatePresence>
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : null;

            return (
              <motion.div
                key={index} // Ideally use a unique ID for files, but index works for simple appends
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative h-32 overflow-hidden border group rounded-card border-light bg-card-bg shadow-custom"
              >
                {isImage ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full p-2 bg-light/20">
                    <i className="mb-2 text-2xl fas fa-file-pdf text-error"></i>
                    <span className="text-[9px] font-black text-text uppercase tracking-tighter text-center truncate w-full px-2">
                      {file.name}
                    </span>
                  </div>
                )}

                {/* Remove Button Overlay */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  className="
                    absolute top-1.5 right-1.5 bg-error text-white w-7 h-7 rounded-full 
                    flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 
                    transition-opacity shadow-lg hover:bg-red-600
                  "
                >
                  <i className="fas fa-times"></i>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};