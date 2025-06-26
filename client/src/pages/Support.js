import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const initialMessages = [
  { from: 'soporte', text: '¡Hola! ¿En qué podemos ayudarte hoy?', time: '09:00' }
];

const Support = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'cliente', text: input, time: '09:01' }]);
    setInput('');
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'soporte', text: 'Gracias por tu mensaje. Pronto te contactaremos.', time: '09:02' }]);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="w-7 h-7 text-primary-500" /> Soporte y Contacto
      </h1>
      <div className="bg-white rounded-lg shadow p-4 h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-2 space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'cliente' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.from === 'cliente' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-700'}`}>
                <span>{msg.text}</span>
                <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 mt-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-primary-300"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded-lg">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Support; 