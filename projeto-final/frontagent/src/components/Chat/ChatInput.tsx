import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUp, Mic, MicOff } from "lucide-react";

type Props = {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  isSending?: boolean;
};

export default function ChatInput({
  input,
  setInput,
  handleSend,
  isSending = false,
}: Props) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(() => {
    if (!textareaRef.current) return;

    requestAnimationFrame(() => {
      if (!textareaRef.current) return;

      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight; // mantém scroll no fim
    });
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [setInput]);

  const toggleListening = () => {
    if (!recognitionRef.current || isSending) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-4">
      <div className="flex flex-col w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={adjustHeight}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isSending) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Digite sua mensagem..."
          disabled={isSending}
          className={`w-full p-3 resize-none overflow-y-auto text-black dark:text-white bg-transparent border-0 outline-none max-h-[150px] scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700
            ${
              isSending ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed" : ""
            }
          `}
          rows={1}
        />

        <div className="flex justify-end space-x-2 px-3 py-2">
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full cursor-pointer transition-colors flex items-center justify-center ${
              isSending
                ? "bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none"
                : listening
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            aria-label={listening ? "Parar de ouvir" : "Falar"}
          >
            {listening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => {
              if (!isSending) handleSend();
            }}
            className={`p-2 rounded-full cursor-pointer flex items-center justify-center text-black dark:text-white ${
              isSending
                ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            }`}
            aria-label="Enviar mensagem"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
