/// <reference path="./libs/typings/wx/lib.wx.app.d.ts" />

interface IApp extends App.GetApp {
	logger: any
	state: any
  wxApi: any

	request_id: number
	requestLock: any

	dispatch(action: string, params?: any)
	commit(action: string, params?: any)
	getter(action: string, params?: any)
}

declare function getApp(): IApp;
