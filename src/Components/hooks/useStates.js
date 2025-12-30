import { useEffect, useState } from "react";

export default function useStates() {
  const [states, setStates] = useState([]);

  useEffect(() => {
    async function fetchStates() {
      try {
        const response = await fetch(
          "https://parseapi.back4app.com/classes/States?limit=50&order=name",
          {
            headers: {
              "X-Parse-Application-Id": "6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK",
              "X-Parse-Master-Key": "WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An",
            },
          }
        );

        const data = await response.json();
        setStates(data.results);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    }

    fetchStates();
  }, []);

  return states;
}
