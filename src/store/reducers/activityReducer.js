const INITIAL_STATE = {
  activities: null,
  filterByActivities: null,
  isActivitiesLoading: false,
  activitiesLength: null,
}

export function activityReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_ACTIVITIES':
      console.log('SET_ACTIVITIES', action.activities)
      return {
        ...state,
        activities: [...action.activities],
      }
    case 'ADD_ACTIVITY':
      console.log('ADD_ACTIVITY')
      return {
        ...state,
        activities: [action.activity, ...state.activities],
      }

    case 'UPDATE_ACTIVITY':
      console.log('UPDATE_ACTIVITY')
      return {
        ...state,
        activities: state.activities.map((activity) => {
          return activity._id === action.activity._id
            ? action.activity
            : activity
        }),
      }

    case 'SET_ACTIVITIES_LENGTH':
      return {
        ...state,
        activitiesLength: action.activitiesLength,
      }

    case 'ADD_FILTER_BY_ACTIVITIES':
      // console.log('ADD_FILTER_BY_ACTIVITIES', action.filterByActivities)
      return {
        ...state,
        filterByActivities: {
          ...state.filterByActivities,
          ...action.filterByActivities,
        },
      }
    case 'SET_FILTER_BY_ACTIVITIES':
      // console.log('SET_FILTER_BY_ACTIVITIES', action.filterByActivities)
      return {
        ...state,
        filterByActivities: action.filterByActivities,
      }

    default:
      return state
  }
}
