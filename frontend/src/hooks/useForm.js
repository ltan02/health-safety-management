import { useState } from "react";
import useAxios from "./useAxios";

export default function useForm() {
  const [forms, setForms] = useState({});

  const { sendRequest } = useAxios();

  const fetchForms = async () => {
    const response = await sendRequest({
      url: "/forms",
    });
    const newForm = {};
    response.map((form) => {
      newForm[form.id] = form;
    });
    console.log(newForm);
    setForms(newForm);
  };

  const updateFieldCoordinate = async (formId, fieldId, coordinate) => {
    try {

      if (!coordinate || !formId || !formId) {
        console.error("Invalid input");
        return;
      }

      console.log("Name: ", forms[formId].fields.find((field) => field.id === fieldId).id);
      console.log("New Coordinate: ", forms[formId].fields.find((field) => field.id === fieldId).coordinate);
      const response = await sendRequest({
        url: `/forms/${formId}/coordinate/${fieldId}`,
        method: "PUT",
        body: {
          x: coordinate.x,
          y: coordinate.y,
        },
      });
      
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return { fetchForms, updateFieldCoordinate, forms };
}
