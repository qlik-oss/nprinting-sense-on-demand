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
						options: function(data) {
							return hlp.getApps(data);
						}
					},
					connection: {
						type: "string",
						component: "dropdown",
						label: "Choose Connection",
						ref: "npsod.conn.id",
						options: function(data) {
							return hlp.getConnectionIds(data);
						},
						change: function (data) {
							// Check if choosen connection have a sense app id that matches current sense app.
							for (var i = 0; i < hlp.connections.length; i++) {
								var connection = hlp.connections[i];
								if (connection.id === data.npsod.conn.id) {
									var qAppPattern = new RegExp('.+appid=' + hlp.qApp.id + ';.+');
									hlp.connectionIdMatch = qAppPattern.test(connection.connectionString);
									break;
								}
							}
						}
					},
					idMissMatch: {
						show: function() {
							return !hlp.connectionIdMatch;
						},
						component: "text",
						translation: "The sense app Id configured in this NPrinting connection does not match current sense app Id.",
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
						defaultValue: true,
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