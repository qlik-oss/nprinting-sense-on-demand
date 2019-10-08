define(["./helpers"], function (hlp) {

	var connection = {
		type: "items",
		label: "NPrinting Connection",
		grouped: true,
		items: {
			server: {
				ref: "npsod.conn.server",
				label: "Server Connection",
				type: "string",
				expression: false,
				change: function(data) {
					data.npsod.conn.app = "";
					data.npsod.conn.id = "";
				}
			},
			relation: {
				type: "items",
				items: {
					app: {
						type: "string",
						component: "dropdown",
						label: "Choose App",
						ref: "npsod.conn.app",
						options: function(data, handler, obj) {
							return hlp.getApps(data, handler.app, obj.model);
						}
					},
					connection: {
						type: "string",
						component: "dropdown",
						label: "Choose Connection",
						ref: "npsod.conn.id",
						options: function(data, handler, obj) {

							var model = obj.model;
							var app = handler.app;

							return model.getProperties().then(function(props) {

								var connQAppId = props.npsod.conn.qApp;

								// Check if saved app id corresponds to current app id.
								if (handler.app.id !== connQAppId && typeof connQAppId !== "undefined") {
									
									props.npsod.conn.qApp = handler.app.id;
									props.useConnectionFilter = false;

									return model.setProperties(props).then(function() {
										return model.getLayout().then(function(layout) {
											return hlp.getConnectionIds(layout, app, model);
										});										
									});
								} else {
									return hlp.getConnectionIds(data, app, model);
								}								
							});
						}
					},
					idMissMatch: {
						show: function(data) {
							return !data.connectionIdMatch;
						},
						component: "text",
						translation: "This connection does not have the current sense app configured and can result in broken reports if selections in target app is a mismatch.",
						style: "hint",
					}
				}
			},
			options: {
				type: "items",
				items: {
					filterConnections: {
						label: "App/Connection filter",
						type: "boolean",
						ref: "useConnectionFilter",
						component: "switch",
						options: [
						{
							value: true,
							translation: "Applied",
						},
						{
							value: false,
							translation: "Bypassed",
						},
						],
					},
					allowShowDetailsMessage: {
						component: "text",
						translation: "Bypass this filter if you want to see connections that are not associated with current Sense app.",
						style: "hint",
					},
				},
			}
		}
	};

	var report = {
		type: "items",
		label: "Report Configuration",
		items: {
			report: {
				type: "string",
				component: "dropdown",
				label: "Choose Report",
				ref: "npsod.conn.report",
				options: function(data) {
					return hlp.getReportsForDropdown(data);
				}
			},
			exportFormat: {
				type: "string",
				component: "dropdown",
				label: "Default Export Format",
				ref: "npsod.conn.exportFormat",
				options: function(data) {
					return hlp.getExportFormatsForDropdown(data);
				}
			}
		}
	};

	var appearance = {
		uses: "settings",
		items: {
			label: {
				ref: "npsod.conn.label",
				label: "Button Label",
				type: "string",
				expression: "optional"
			},
			selections: {
			  show:false
			},
			general: {
				items: {
					details: {
						show: false
					}
				}
			},
		}
	};

	var about = {
		label: "About",
		component: "items",
		items: {
			header: {
				label: 'On-demand reporting',
				style: 'header',
				component: 'text'
			},
			paragraph1: {
				label: 'A control that allows a user to generate an NPrinting report on demand.',
				component: 'text'
			},
			paragraph2: {
				label: 'On-demand reporting is based upon an extension created by S-cubed.',
				component: 'text'
			}
		}
	};

	return {
		type: "items",
		component: "accordion",
		items: {
			appearance: appearance,
			connection: connection,
			report: report,
			about: about
		}
	};
});