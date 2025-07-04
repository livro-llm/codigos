import { useState, useEffect, useRef } from "react";
import { ArrowUp, Mic, MicOff } from "lucide-react";

type Props = {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
};

export default function ChatInput({ input, setInput, handleSend }: Props) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
    if (!recognitionRef.current) return;

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
      <div className="relative w-full flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Digite sua mensagem..."
          className="w-full p-3 pr-20 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />

        <button
          onClick={toggleListening}
          className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
            listening
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
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-blue-600 dark:hover:bg-blue-700 text-black dark:text-white"
          onClick={handleSend}
          aria-label="Enviar mensagem"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
