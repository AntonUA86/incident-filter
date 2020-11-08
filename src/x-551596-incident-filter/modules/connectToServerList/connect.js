import { createHttpEffect } from "@servicenow/ui-effect-http";
import { actionTypes } from "@servicenow/ui-core";

const {COMPONENT_BOOTSTRAPPED} = actionTypes;


export const actionHandlers = {
    [COMPONENT_BOOTSTRAPPED]: (coeffects) => {
        const { dispatch } = coeffects;

        dispatch("FETCH_LATEST_INCIDENT", {
            sysparm_display_value: "true"
        });
    },
    "NOW_DROPDOWN_PANEL#ITEM_CLICKED": (coeffects) => {
        const { action, updateState, dispatch } = coeffects;
        const { id } = action.payload.item;
        const componentId = action.meta.path.find(id => id.length >= 32);
        if (id === "more_info") {
            const { incedentsRender } = coeffects.state;
            const incidentArr = incedentsRender.find(incident => incident.sys_id === componentId);
            updateState({ incidentArr, isIncidentModal: true });
        } else if (id === "delete") {
            dispatch("DELETE_INCIDENT_ITEM", { sys_id: componentId });
        }
    },
    "FETCH_LATEST_INCIDENT": createHttpEffect("api/now/table/incident", {
        method: "GET",
        queryParams: ["sysparm_display_value"],
        successActionType: "FETCH_LATEST_INCIDENT_SUCCESS"
    }),
    "FETCH_LATEST_INCIDENT_SUCCESS": (coeffects) => {
        const incidents = [];
        const incedentsRender = [];
        const { action, updateState } = coeffects;
        const { result } = action.payload;
        result.forEach(incident => {
            incedentsRender.push(
                {
                    short_description: incident.short_description,
                    number: incident.number,
                    state: incident.state,
                    assignment_group: incident.assignment_group,
                    assigned_to: incident.assigned_to,
                    sys_updated_on: incident.sys_updated_on,
                    sys_id: incident.sys_id
                }
            );
            incidents.push(
                {
                    tagline: {
                        icon: "tree-view-long-outline", label: "Incident"
                    },
                    actions: [
                        {id: "more_info", label: "Open Record"},
                        {id: "delete", label: "Delete"}
                    ],
                    heading: {
                        label: incident.short_description
                    },
                    content: [
                        {label: "Number", value: {type: "string", value: incident.number}},
                        {label: "State", value: {type: "string", value: incident.state}},
                        {label: "Assignment Group", value: {type: "string", value:
                            incident.assignment_group.display_value 
                        }},
                        {label: "Assigned To", value: {type: "string", value:
                            incident.assigned_to.display_value 
                        }}
                    ],
                    footerContent: {
                        label: "Updated",
                        value: incident.sys_updated_on
                    },
                    sys_id: incident.sys_id
                }
            )
        });
        updateState({ incidents, incedentsRender });
    },
    "DELETE_INCIDENT_ITEM": createHttpEffect(`api/now/table/incident/:sys_id`, {
        method: "DELETE",
        pathParams: ['sys_id'],
        successActionType: "FETCH_LATEST_INCIDENT"
    }),
    "NOW_MODAL#OPENED_SET": (coeffects) => {
        const { updateState} = coeffects;
        updateState({isIncidentModal: false});
    },
    "NOW_MODAL#FOOTER_ACTION_CLICKED": (coeffects) => {
        const { state, updateState, dispatch } = coeffects;
        const { incidentArr} = state;
        dispatch("DELETE_INCIDENT_ITEM", { sys_id: incidentArr.sys_id });
        updateState({isIncidentModal: false});
    
},
"FIND_INCIDENTS": (coeffects) => {
    const { updateState, state } = coeffects;
    updateState({
        foundIncidents: !!state.inpValue ? state.incidents.filter(incident =>
            state.stateSearch === "all" ? incident.heading.label.toLowerCase().match(state.inpValue) :
        (
            incident.heading.label.toLowerCase().match(state.inpValue) && 
            incident.content[1].value.value.toLowerCase() === state.stateSearch)) :[],
            isSearch: !!state.inpValue ? true : false
    });
},
"UPDATE_SEARCH_VALUE": (coeffects) => {
    const { updateState, action} = coeffects;
    updateState({
        inpValue: action.payload.inpValue,
    });
},
"CHANGE_STATE_SELECT": (coeffects) => {
    const { updateState, action } = coeffects;
    updateState({
        stateSearch: action.payload.stateSearch
    });
}
}