import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectGroups,
  addGroup,
  deleteGroup,
  updateGroup,
} from "../store/groupSlice";

const Todo = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectGroups);


  const [groupResults, setGroupResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleAddGroup = () => {
    const errors = validateGroups();
    if (errors) {
      alert(errors);
      return;
    }
    dispatch(addGroup({ from: "", to: "" }));
  };

  const handleDeleteGroup = (index) => {
    if (groups.length <= 1) {
      alert("At least one group must be present!");
      return;
    }

    dispatch(deleteGroup(index));

    const newGroupResults = [...groupResults];
    newGroupResults.splice(index, 1);
    setGroupResults(newGroupResults);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;

    dispatch(updateGroup({ index, name, value }));
  };

  const handleShowResult = async () => {
    try {
      const errors = validateGroups();
      if (errors) {
        alert(errors);
        return;
      }
      setLoading(true);
      const newGroupResults = [];
      for (const group of groups) {
        const groupResult = [];
        for (let i = group.from; i <= group.to; i++) {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${i}`
          );
          const todoData = await response.json();
          groupResult.push({ id: i, completed: todoData.completed });
        }
        newGroupResults.push(groupResult);
      }
      setGroupResults(newGroupResults);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("something went wrong while loading tast status", error);
      console.error("Error fetching todo status:", error);
    }
  };

  const validateGroups = () => {
    const allNumbers = groups.flatMap((group) =>
      Array.from(
        { length: group.to - group.from + 1 },
        (_, i) => i + group.from
      )
    );
    const sortedGroups = groups.slice().sort((a, b) => a.from - b.from);

    for (let i = 0; i < sortedGroups.length; i++) {
      const group = sortedGroups[i];
      if (group.from === "" || group.to === "") {
        return "Please fill in all group ranges.";
      }
      if (group.from >= group.to) {
        return "Invalid range: 'From' must be less than 'To'.";
      }
      if (group.from < 1 || group.to > 10) {
        return "Group range must be within 1-10.";
      }
      if (i > 0 && sortedGroups[i - 1].to >= group.from) {
        return "Group ranges should not overlap.";
      }
    }

    if (allNumbers.length !== 10) {
      return "The entire range of 1-10 should be covered.";
    }

    return null;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          {groups.map((group, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <span
                className="trash-icon"
                onClick={() => handleDeleteGroup(index)}
              >
                <i className="fas fa-trash-alt"></i>
              </span>
              <div className="input-group ml-3">
                <span className="input-group-text">Group {index + 1}</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="from"
                  name="from"
                  value={group.from}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <span className="input-group-text">
                  <i className="fa-solid fa-right-long"></i>
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="to"
                  name="to"
                  value={group.to}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>
            </div>
          ))}
          <div>
            <i className="fa-solid fa-plus" onClick={handleAddGroup}>
              Add Group
            </i>
          </div>

          <button className="btn btn-primary mt-5" onClick={handleShowResult}>
            Show Status
          </button>
        </div>

        <div className="col-8">
        {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              ...Loading task status
            </div>
          ) : (
            groupResults.length > 0 && (
              <>
                {groupResults.map((groupResult, index) => (
                  <div key={index} className="results mt-2">
                    {groupResult.map(({ id, completed }, idx) => (
                      <span key={id}>
                        {completed ? "Completed " : " Not Completed"}
                        {idx !== groupResult.length - 1 && ";"}
                      </span>
                    ))}
                  </div>
                ))}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
