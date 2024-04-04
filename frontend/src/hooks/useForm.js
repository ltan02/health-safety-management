import { useState } from "react";
import useAxios from "./useAxios";
import { FIELD_TYPES } from "../components/form/form_data";
import { set } from "lodash";

export default function useForm() {
  const [forms, setForms] = useState({});
  const [activeForm, setActiveForm] = useState({});

  const { sendRequest, loading } = useAxios();

  const fetchForms = async () => {
    const response = await sendRequest({
      url: "/forms",
    });
    const employees = await sendRequest({
      url: "/users",
      method: "GET",
    });
    
    const newForm = {};
    response.map((form) => {
      newForm[form.id] = form;
    });
    Object.keys(newForm).map((key) => {
      newForm[key].fields = newForm[key].fields.map((field) => {
        if (field.props.name === "employees_involved") {
          field.props.options = employees.map((employee) => ({
            value: employee.id,
            label: employee.firstName + " " + employee.lastName,
          }));
        }
        return field;
      });
    });
    response.map((form) => {
      if (form.active) {
        setActiveForm(form);
      }
    });
    setForms(newForm);
  };

  const createNewForm = async (form) => {
    try {
      if (!form) {
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: "/forms",
        method: "POST",
        body: form,
      });
      return response;
    }
    catch (error) {
      console.error(error);
    }
    
  };

  const addDefaultFields = async (formId) => {
    try {
      if (!formId) {
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: `/forms/${formId}/default`,
        method: "PUT",
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteForm = async (formId) => {
    try {
      if (!formId) {
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: `/forms/${formId}`,
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error(error);
    }
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

  const updateForm = async (form) => {
    try {
      if (!form) {
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: `/forms/${form.id}`,
        method: "PUT",
        body: form,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const updateField = async (formId, field) => {
    try {
      if (!formId || !field || !field.props) {
        console.error("Invalid input");
        return;
      }

      const response = await sendRequest({
        url: `/forms/${formId}/field/${field.id}`,
        method: "PUT",
        body: field,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const getActiveForm = async () => {
    try {
      const response = await sendRequest({
        url: "/forms/active",
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const setFormActive = async (formId) => {
    try {
      if (!formId) {
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: `/forms/${formId}/active`,
        method: "PUT",
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const toggleForm = async (formId) => {
    try {
      if (!formId || formId === activeForm.id) {
        return;
      }
      await setFormInactive(activeForm.id);
      await setFormActive(formId);
    } catch (error) {
      console.error(error);
    }
  };

  const setFormInactive = async (formId) => {
    try {
      if (!formId) {
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: `/forms/${formId}/inactive`,
        method: "PUT",
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const groupedByRows = (fields, cols) => {
    if(fields.length <= 0) return {};
    console.log(fields);
    const newFields = fields.reduce((acc, field) => {
      const { y } = field.coordinate;
      if (!acc[y]) {
        acc[y] = [];
      }
      acc[y].push(field);
      return acc;
    }, {});

    for(let i = 0; i < cols; i++) {
      if (!newFields[i]) {
        newFields[i] = [];
      }
    }


    Object.keys(newFields).map((key) => {
      if (newFields[key].length < cols) {
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



  const updateFormName = async (formId, name) => {
    try {
      if (!formId || !name) {
        console.error("Invalid input");
        return;
      }
      const response = await sendRequest({
        url: `/forms/${formId}/name`,
        method: "POST",
        body: { name },
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  

  return {
    fetchForms,
    toggleForm,
    createNewForm,
    deleteForm,
    updateAllFieldCoordinates,
    forms,
    activeForm,
    setFormActive,
    setFormInactive,
    addField,
    updateField,
    groupedByRows,
    sortedRows,
    getLastCoordinate,
    deleteField,
    loading,
    updateFormName,
    updateForm
  };
}
