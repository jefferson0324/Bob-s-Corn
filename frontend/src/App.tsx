import { useState } from "react";
import { Button } from "./components/Button";

const App: React.FC = () => {
  const [clientId, setClientId] = useState<string>("");
  const [cornBought, setCornBought] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const handleBuyCorn = async () => {
    if (!clientId) {
      setError("Client ID is required.");
      return;
    }

    try {
      setError("");
      const response = await fetch("http://localhost:4444/buy-corn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId }), 
      });

      if (response.status === 200) {
        setCornBought((prev) => prev + 1);
      } else if (response.status === 429) {
        setError("You're buying too much corn! Wait a bit.");
      } else if (response.status === 400) {
        setError("Client ID is required.");
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 w-full h-screen">
      <h1 className="text-3xl font-bold mb-4">🌽 Bob's Corn Shop 🌽</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <p className="mb-2">Corn bought: {cornBought}</p>
      <Button onClick={handleBuyCorn} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Buy Corn</Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default App;