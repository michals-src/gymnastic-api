export function getRequestParam(params: Record<string, any>, paramName: string) {
	return {
		_validator: null,
		validate: (fn: (val: any) => boolean) => {
			this._validator = fn;
		},
		value: (): any => {
			if (params.hasOwnProperty(paramName) === false) throw Error(`Missing parameter ${paramName}`);
			if (Boolean(this._validator) && this._validator === false) throw Error(`Invalid parameter ${paramName}`);
			return params[paramName];
		},
	};
}
