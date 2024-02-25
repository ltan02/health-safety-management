export const STATE = {
  INPROGRESS: "Awaiting Response",
  DONE: "Done",
  TODO: "Needs Review",
  INACTIVE: "Inactive",
};

export const COLUMNS = [
    { id: STATE.TODO, title: "Needs Review" },
    { id: STATE.INPROGRESS, title: "Awaiting Response" },
    { id: STATE.DONE, title: "Done" },
];

// assume that we can get the tasks from api something like this
export const initialTasks = [
  {
    id: "0001", //random things here
    title: "Fix some issues",
    assignee: "John Doe",
    description: "There are some issues that need to be fixed",
    status: STATE.INACTIVE,
    deadline: "2024-02-31:20:20:00",
  },
  {
    id: "0002",
    title: "Update workflows",
    assignee: "Jane Smith",
    description: "Update workflows",
    status: STATE.INPROGRESS,
    deadline: "2024-10-31:20:20:00",
  },
  {
    id: "0003",
    title: "Create a new workflows",
    assignee: "Alice Johnson",
    description: "Update workflows",
    status: STATE.DONE,
    deadline: "2024-01-30:20:20:00",
  },
  {
    id: "0004",
    title: "Add report",
    assignee: "Bob Brown",
    description:
      "Implement the new communication feature as per the specifications.",
    status: STATE.TODO,
    deadline: "2024-12-31:20:20:00",
  },
];
