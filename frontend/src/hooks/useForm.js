import { useState } from "react";
import useAxios from "./useAxios";
import { FIELD_TYPES } from "../components/form/form_data";

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
    const newFields = fields.reduce((acc, field) => {
      const { y } = field.coordinate;
      if (!acc[y]) {
        acc[y] = [];
      }
      acc[y].push(field);
      return acc;
    }, {});

    Object.keys(newFields).map((key) => {
      if (newFields[key].length < 2) {
        let coordinate = {
          x: 0,
          y: Number(key),
        };
        if (newFields[key][0].coordinate.x === 0) {
          coordinate = {
            x: 1,
            y: Number(key),
          };
        } else {
          coordinate = {
            x: 0,
            y: key,
          };
        }
        const emptyField = {
          id: "empty" + key,
          name: "Empty",
          type: FIELD_TYPES.EMPTY,
          props: {},
          coordinate: coordinate,
        };
        newFields[key].push(emptyField);
      }
    });  

    return newFields;
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
