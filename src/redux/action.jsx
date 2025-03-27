
export const ThemeChanger = (value) => async (dispatch) => {
  dispatch({
    type: "ThemeChanger",
    payload: value
  });
};

export const AddToCart = (id) => async (dispatch) => {
  dispatch({
    type: "ADD_TO_CART",
    payload: id
  });
};
export const ProductReduxData = (id) => async (dispatch) => {
  dispatch({
    type: "PRODUCT",
    payload: id
  });
};
export const SetUserData = (value) => async (dispatch) => {
  dispatch({
    type: "SET_USER_DATA",
    payload: value
  });
};
export const SetUserId = (value) => async (dispatch) => {
  dispatch({
    type: "SET_USER_ID",
    payload: value
  });
}
export const SetAuth = (value) => async (dispatch) => {
  dispatch({
    type: "SET_AUTH",
    payload: value
  });
}
export const SetGoogleAccessToken = (value) => async (dispatch) => {
  dispatch({
    type: "SET_GOOGLE_ACCESS_TOKEN",
    payload: value
  });
}
