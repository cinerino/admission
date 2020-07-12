import { factory } from '@cinerino/api-javascript-client';
import { createAction, props } from '@ngrx/store';
import { Models } from '../..';
const LABEL = '[Order]';

export const remove = createAction(
    `${LABEL} remove`,
);

export const inquiry = createAction(
    `${LABEL} inquiry`,
    props<{
        confirmationNumber: string;
        customer: {
            email?: string;
            telephone?: string;
        };
    }>()
);

export const inquirySuccess = createAction(
    `${LABEL} inquirySuccess`,
    props<{ order: factory.order.IOrder }>()
);

export const inquiryFail = createAction(
    `${LABEL} inquiryFail`,
    props<{ error: Error }>()
);

export const print = createAction(
    `${LABEL} print`,
    props<{
        orders: factory.order.IOrder[];
        printer: Models.Util.Printer.IPrinter;
        pos?: factory.chevre.place.movieTheater.IPOS;
        timeout?: number;
    }>()
);

export const printSuccess = createAction(
    `${LABEL} printSuccess`,
);

export const printFail = createAction(
    `${LABEL} printFail`,
    props<{ error: Error }>()
);

export const orderAuthorize = createAction(
    `${LABEL} orderAuthorize`,
    props<{
        orderNumber: string;
        customer: {
            email?: string;
            telephone?: string;
        };
    }>()
);

export const orderAuthorizeSuccess = createAction(
    `${LABEL} orderAuthorizeSuccess`,
    props<{ order: factory.order.IOrder }>()
);

export const orderAuthorizeFail = createAction(
    `${LABEL} orderAuthorizeFail`,
    props<{ error: Error }>()
);