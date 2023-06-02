import {
	CannotSaveEntityError,
	ForbiddenError,
	InvalidAuthorizationHeaderError,
	InvalidRequestBodyError,
	InvalidRequestQueryError,
	MissingAuthorizationHeaderError,
	RequestNotFoundError,
	RequestServerError,
	ResponseError,
	UnauthorizedError,
} from '@/errors';
import { Environment } from '@/helpers';

describe('ResponseError', () => {
	it('should set all values', () => {
		const previous = new Error('previous');
		const error = new ResponseError('message', previous);

		expect(error.getCode()).toBe(0);
		expect(error.getPrevious()).toBe(previous);
		expect(error.getHint()).toBe(undefined);
		expect(error.getHttpCode()).toBe(200);
		expect(error.getName()).toBe('ResponseError');
		expect(error.getMessage()).toBe('message');
		expect(error.getPayload()).toStrictEqual({});
		expect(error.getPreviousJSON()?.message).toBe('previous');
		expect(error.getPreviousJSON()?.name).toBe('Error');

		// when debugging
		jest.spyOn(Environment, 'get').mockReturnValue({ debug: true });

		expect(error.toJSON().stack).not.toBe(undefined);

		// when not debugging
		jest.spyOn(Environment, 'get').mockReturnValue({ debug: false });

		expect(error.toJSON()).toStrictEqual({
			code: 0,
			name: 'ResponseError',
			message: 'message',
			status: 200,
		});

		error
			.changeName('NewName')
			.code(1)
			.hint('hint')
			.httpCode(400)
			.payload({ a: 1 });

		expect(error.toJSON()).toStrictEqual({
			code: 1,
			name: 'NewName',
			message: 'message',
			hint: 'hint',
			status: 400,
			body: {
				a: 1,
			},
		});
	});

	it('should be RequestNotFoundError error', () => {
		const error = new RequestNotFoundError();

		expect(error.getName()).toBe('RequestNotFoundError');
		expect(error.getCode()).toBe(103);
		expect(error.getHttpCode()).toBe(404);
		expect(error.getPrevious()).toBe(undefined);
		expect(error.getHint()).toBe(
			'You must check the URL or the request parameters.'
		);
		expect(error.getMessage()).toBe('Request not found.');
	});

	it('should be RequestServerError error', () => {
		const error = new RequestServerError();

		expect(error.getName()).toBe('RequestServerError');
		expect(error.getCode()).toBe(102);
		expect(error.getHttpCode()).toBe(500);
		expect(error.getHint()).toBe(
			'The server was unable to handle this request.'
		);
		expect(error.getMessage()).toBe('Invalid request.');
		expect(error.getPrevious()).toBe(undefined);
	});

	it('should be InvalidRequestBodyError error', () => {
		const error = new InvalidRequestBodyError(['a => must be set']);

		expect(error.getName()).toBe('InvalidRequestBodyError');
		expect(error.getCode()).toBe(106);
		expect(error.getHttpCode()).toBe(422);
		expect(error.getHint()).toBe(
			'One or more values were not accepted at request body.'
		);
		expect(error.getMessage()).toBe('The request body is invalid.');
		expect(error.getPayload()).toStrictEqual(['a => must be set']);
		expect(error.getPrevious()).toBe(undefined);
	});

	it('should be InvalidRequestQueryError error', () => {
		const error = new InvalidRequestQueryError();

		expect(error.getName()).toBe('InvalidRequestQueryError');
		expect(error.getCode()).toBe(107);
		expect(error.getHttpCode()).toBe(422);
		expect(error.getHint()).toBe(
			'One or more values were not accepted at request query.'
		);
		expect(error.getMessage()).toBe('The request query is invalid.');
		expect(error.getPrevious()).toBe(undefined);
	});

	it('should be MissingAuthorizationHeaderError error', () => {
		const error = new MissingAuthorizationHeaderError();

		expect(error.getName()).toBe('MissingAuthorizationHeaderError');
		expect(error.getCode()).toBe(104);
		expect(error.getHttpCode()).toBe(401);
		expect(error.getHint()).toBe('The `Authorization` header is required.');
		expect(error.getMessage()).toBe('Missing authorization header.');
		expect(error.getPrevious()).toBe(undefined);
	});

	it('should be InvalidAuthorizationHeaderError error', () => {
		const error = new InvalidAuthorizationHeaderError();

		expect(error.getName()).toBe('InvalidAuthorizationHeaderError');
		expect(error.getCode()).toBe(105);
		expect(error.getHttpCode()).toBe(401);
		expect(error.getHint()).toBe(
			'The `Authorization` header must be of `Bearer` type.'
		);
		expect(error.getMessage()).toBe('Invalid authorization header.');
		expect(error.getPrevious()).toBe(undefined);
	});

	it('should be CannotSaveEntityError error', () => {
		const error = new CannotSaveEntityError();

		expect(error.getName()).toBe('CannotSaveEntityError');
		expect(error.getCode()).toBe(109);
		expect(error.getHttpCode()).toBe(500);
		expect(error.getHint()).toBe(
			'Your request cannot be processed due an internal error.'
		);
		expect(error.getMessage()).toBe('Cannot save any data.');
		expect(error.getPrevious()).toBe(undefined);
	});

	it('should be ForbiddenError error', () => {
		const error = new ForbiddenError();

		expect(error.getName()).toBe('ForbiddenError');
		expect(error.getCode()).toBe(108);
		expect(error.getHttpCode()).toBe(403);
		expect(error.getHint()).toBe(
			"You don't have enough permissions for this request."
		);
		expect(error.getMessage()).toBe('Access not allowed.');
		expect(error.getPrevious()).toBe(undefined);
	});

	it('should be UnauthorizedError error', () => {
		const error = new UnauthorizedError();

		expect(error.getName()).toBe('UnauthorizedError');
		expect(error.getCode()).toBe(101);
		expect(error.getHttpCode()).toBe(401);
		expect(error.getHint()).toBe('Your credentials are invalid or expired.');
		expect(error.getMessage()).toBe('Credentials not allowed.');
		expect(error.getPrevious()).toBe(undefined);
	});
});
