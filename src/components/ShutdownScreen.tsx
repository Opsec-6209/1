import { motion, AnimatePresence } from "framer-motion";

interface ShutdownScreenProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ShutdownScreen({ show, onCancel, onConfirm }: ShutdownScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bevel-out-dark bg-[#c0c0c0] p-1 w-[min(92vw,360px)]"
          >
            <div className="win95-title px-2 py-1 font-pixel text-[10px] text-[#f0f0f0]">
              Shut Down opsec_98
            </div>
            <div className="p-4 font-mono-y2k text-[12px] text-black">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">💻</div>
                <div>
                  <p className="mb-2">Are you sure you want to:</p>
                  <div className="space-y-1 mb-3 ml-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="shutdown" defaultChecked /> Stand by
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="shutdown" /> Shut down
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="shutdown" /> Restart
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={onConfirm}
                  className="bevel-out-dark px-4 py-1 hover:bg-[#d0d0d0] text-[12px] font-bold"
                >
                  OK
                </button>
                <button
                  onClick={onCancel}
                  className="bevel-out-dark px-4 py-1 hover:bg-[#d0d0d0] text-[12px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BlackScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black flex items-center justify-center"
        >
          <div className="text-center font-mono-y2k text-[#f0f0f0]">
            <p className="text-lg mb-4">It is now safe to turn off</p>
            <p className="text-lg mb-4">your computer.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 bevel-out-dark px-4 py-1 text-[10px] text-black bg-[#c0c0c0]"
            >
              Power on again
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
