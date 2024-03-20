import { useState } from "react";
import useAxios from "./useAxios";

export default function useForm() {
  const [forms, setForms] = useState({});

  const { sendRequest, loading } = useAxios();

  const fetchForms = async () => {
    const response = await sendRequest({
      url: "/forms",
    });
    const newForm = {};
    response.map((form) => {
      newForm[form.id] = form;
    });
    setForms(newForm);
  };

  const updateAllFieldCoordinates = async (formId, fields) => {
    try {
      if (!fields || !formId) {
        console.error("Invalid input");
        return;
      }

      const response = await sendRequest({
        url: `/forms/${formId}/coordinate`,
        method: "PUT",
        body: fields,
      });

      console.log("Fields: ", response);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const addField = async (formId, field) => {
    try {
      if (!formId || !field) {
        console.error("Invalid input");
        return;
      }

      const response = await sendRequest({
        url: `/forms/${formId}/field`,
        method: "PUT",
        body: field,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteField = async (formId, fieldId) => {
    try {
      if (!formId || !fieldId) {
        console.error("Invalid input");
        return;
      }

      const response = await sendRequest({
        url: `/forms/${formId}/field/${fieldId}`,
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const groupedByRows = (fields) => {
    return fields.reduce((acc, field) => {
      const { y } = field.coordinate;
      if (!acc[y]) {
        acc[y] = [];
      }
      acc[y].push(field);
      return acc;
    }, {});
  };

  const sortedRows = (groupedByRows) => {
    return Object.keys(groupedByRows)
      .sort((a, b) => a - b)
      .map((y) => ({
        row: y,
        fields: groupedByRows[y].sort(
          (a, b) => a.coordinate.x - b.coordinate.x
        ),
      }));
  };

  const getLastCoordinate = (fields) => {
    let lastCoordinate = fields.reduce(
      (acc, field) => {
        if (field.coordinate.y > acc.y) {
          return field.coordinate;
        }
        if (field.coordinate.y === acc.y) {
          if (field.coordinate.x > acc.x) {
            return field.coordinate;
          }
        }
        return acc;
      },
      { x: 0, y: 0 }
    );
    console.log(lastCoordinate);
    return lastCoordinate;
  };

  return {
    fetchForms,
    updateAllFieldCoordinates,
    forms,
    addField,
    groupedByRows,
    sortedRows,
    getLastCoordinate,
    deleteField,
    loading
  };
}
