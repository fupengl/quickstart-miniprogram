interface WXEventTarget {
	id: string;
	offsetLeft: number;
	offsetTop: number;
	dataset: {
		[key: string]: any;
	}
}

interface WXEventBasic {
	type: string;
	timeStamp: number;
	target: WXEventTarget;
	currentTarget: WXEventTarget;
	detail: {
		formId?: string;
		value?: any;
		userInfo?: Object;
		[key: string]: any;
	}
}