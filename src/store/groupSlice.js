import { createSlice } from '@reduxjs/toolkit';

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [{ from: 1, to: 10 }],
  },
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    deleteGroup: (state, action) => {
      state.groups.splice(action.payload, 1);
    },
    updateGroup: (state, action) => {
      const { index, name, value } = action.payload;
      state.groups[index][name] = value === "" ? null : parseInt(value) || "";
    },
  },
});

export const { addGroup, deleteGroup, updateGroup } = groupSlice.actions;

export const selectGroups = (state) => state.group.groups;

export default groupSlice.reducer;
