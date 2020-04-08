import {createStore,applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
const initialGlobalState ={
    enum:{
        PdKind:{
            1:'单船票',
            2:'邮轮套餐',
            3:'河轮套餐'
        },
    }
};

const SET_ENUM = 'SET_ENUM';

const reducer = (state = initialGlobalState,action) => {
    switch (action.type) {
        case SET_ENUM:
            return {
                ...state,
                enum:{
                    ...state.enum,
                    ...action['enum'],
                }
            }
        default:
            return state;
    }
}

//ACTIONS
export function updateEnum(){
    return async (dispatch) =>{
        const r = await fetch(`http://localhost:8080/liner-back/files/TY_LINER/cache/Enum.js`);
        const rst = await r.json();    
        dispatch({type:SET_ENUM,enum:rst});
    }
}

export default (state) =>{
    const store = createStore(reducer,Object.assign({},{
        enum : {
            ...initialGlobalState.enum,
            ...state.enum
        }
    }),applyMiddleware(ReduxThunk));
    return store;
};