import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import "@servicenow/now-template-card";
import {actionHandlers} from './modules/connectToServerList/connect';
import "@servicenow/now-modal";

const changeSearchVal = (e, dispatch) => {
	dispatch("UPDATE_SEARCH_VALUE", {inpValue: e.target.value.toLowerCase().trim()});
};
const changeStateSearch = (e, dispatch) => {
	dispatch("CHANGE_STATE_SELECT", {stateSearch: e.target.value});
};
const view = (state, {dispatch}) => {

	const {incidents,isIncidentModal, incidentArr,isSearch,foundIncidents} = state;
	const renderIncidents = (!!foundIncidents.length || isSearch) ? foundIncidents : incidents;
	return (
		<div className="card-list">
			<div classNam='wrapper__screach'>
				<input 
				oninput={(e) => changeSearchVal(e, dispatch)}
				type="search"
				placeholder="Search ...."
				onkeyup={(i) => dispatch("FIND_INCIDENTS")
					}/>
				<button onclick={() => dispatch("FIND_INCIDENTS")}>Search</button>
				{state.inpValue && <div className="search-area-select">
					<label>State: </label>
					<select name="state" onchange={(e) => changeStateSearch(e, dispatch)}>
						<option value="all">All</option>
						<option value="new">New</option>
						<option value="in progress">In progress</option>
						<option value="on hold">On Hold</option>
						<option value="resolved">Resolved</option>
						<option value="closed">Closed</option>
						<option value="canceled">Canceled</option>
					</select>
				</div>}
				
			</div>
		{renderIncidents.map(incident => (
				<now-template-card-assist
				tagline={incident.tagline}
				actions={incident.actions}
				heading={incident.heading}
				content={incident.content}
				className="incident"
				component-id={incident.sys_id}
				footer-content={incident.footerContent}
				/>
			))}
			<now-modal
	footerActions={[{"label":"Delete","variant":"primary-negative"}]}
	size="lg" opened={isIncidentModal} className="now__modal">
    {incidentArr && 
				<div className="wrapper__modal">
					<div className="modal__item">
						<p className="modal__item--title">
							Number
						</p>	
						<span className="modal__item--description">
							{incidentArr.number}
						</span>
					</div>
					<div className="modal__item">
						<p className="modal__item--title">
							State
						</p>
						<span className="modal__item--description">
							{incidentArr.state}
						</span>
					</div>
					<div className="modal__item">
						<p className="modal__item--title">
							Updated At
						</p>
						<span className="modal__item--description">
							{incidentArr.sys_updated_on}
						</span>
					</div>
					<div className="modal__item">
						<p className="modal__item--title">
							Short Description
						</p>
						<span className="modal__item--description">
							{incidentArr.short_description}
						</span>
					</div>
					<div className="modal__item">
						<p className="modal__item--title">
							Assignment Group
						</p>
						<span className="modal__item--description">
							{incidentArr.assignment_group.display_value}
						</span>
					</div>
					<div className="modal__item">
						<p className="modal__item--title">
							Assigned To
						</p>
						<span className="modal__item--description">
							{incidentArr.assigned_to.display_value}
						</span>
					</div>
				</div>}
        	</now-modal>
		</div>
	);
};

createCustomElement('x-551596-incident-delete', {
	actionHandlers ,
	renderer: {type: snabbdom},
	initialState: {
		isIncidentModal: false,
		inpValue: "",
		foundIncidents: [],
		isSearch: false,
		stateSearch: "all"
	},
	view,
	styles
});
