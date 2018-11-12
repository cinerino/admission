import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OK } from 'http-status';
import * as decode from 'jwt-decode';
import { map, mergeMap } from 'rxjs/operators';
import { IDecodeResult } from '../../model';
import { CinerinoService } from '../../services/cinerino.service';
import {
    ActionTypes,
    Admission,
    AdmissionFail,
    AdmissionSuccess,
    ConvertQrcodeToToken,
    ConvertQrcodeToTokenFail,
    ConvertQrcodeToTokenSuccess,
    GetScreeningEventReservations,
    GetScreeningEventReservationsFail,
    GetScreeningEventReservationsSuccess,
    GetScreeningEvents,
    GetScreeningEventsFail,
    GetScreeningEventsSuccess,
    GetTheaters,
    GetTheatersFail,
    GetTheatersSuccess
} from '../actions';

/**
 * Effects
 */
@Injectable()
export class Effects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService,
    ) { }

    /**
     * getTheaters
     */
    @Effect()
    public getTheaters = this.actions.pipe(
        ofType<GetTheaters>(ActionTypes.GetTheaters),
        map(action => action.payload),
        mergeMap(async (payload) => {
            // console.log(payload);
            try {
                await this.cinerino.getServices();
                const movieTheaters = await this.cinerino.organization.searchMovieTheaters(payload.params);
                return new GetTheatersSuccess({ movieTheaters });
            } catch (error) {
                return new GetTheatersFail({ error: error });
            }
        })
    );

    /**
     * getScreeningEvents
     */
    @Effect()
    public getScreeningEvents = this.actions.pipe(
        ofType<GetScreeningEvents>(ActionTypes.GetScreeningEvents),
        map(action => action.payload),
        mergeMap(async (payload) => {
            // console.log(payload);
            try {
                await this.cinerino.getServices();
                const screeningEvents = await this.cinerino.event.searchScreeningEvents(payload.params);
                return new GetScreeningEventsSuccess({ screeningEvents });
            } catch (error) {
                return new GetScreeningEventsFail({ error: error });
            }
        })
    );

    /**
     * getScreeningEventReservations
     */
    @Effect()
    public getScreeningEventReservations = this.actions.pipe(
        ofType<GetScreeningEventReservations>(ActionTypes.GetScreeningEventReservations),
        map(action => action.payload),
        mergeMap(async (payload) => {
            // console.log(payload);
            try {
                await this.cinerino.getServices();
                const screeningEventReservations = await this.cinerino.reservation.searchScreeningEventReservations(payload.params);
                return new GetScreeningEventReservationsSuccess({ screeningEventReservations });
            } catch (error) {
                return new GetScreeningEventReservationsFail({ error: error });
            }
        })
    );

    /**
     * convertQrcodeToToken
     */
    @Effect()
    public convertQrcodeToToken = this.actions.pipe(
        ofType<ConvertQrcodeToToken>(ActionTypes.ConvertQrcodeToToken),
        map(action => action.payload),
        mergeMap(async (payload) => {
            // console.log(payload);
            try {
                await this.cinerino.getServices();
            } catch (error) {
                return new ConvertQrcodeToTokenFail({ error });
            }
            const code = payload.params.code;
            const screeningEventReservations = payload.params.screeningEventReservations;
            let token: string;
            try {
                const getTokenResult = await this.cinerino.admin.ownershipInfo.getToken({ code });
                token = getTokenResult.token;
            } catch (error) {
                const checkTokenActions = { totalCount: 0, data: [] };
                const isAvailable = false;
                const statusCode = error.code;
                return new ConvertQrcodeToTokenSuccess({ checkTokenActions, isAvailable, statusCode });
            }
            try {
                const decodeResult = decode<IDecodeResult>(token);
                const checkTokenActions = await this.cinerino.admin.ownershipInfo.searchCheckTokenActions({ id: decodeResult.id });
                // 利用可能判定
                console.log(screeningEventReservations.data
                    .filter((r) => r.reservationStatus === factory.chevre.reservationStatusType.ReservationConfirmed));

                const availableReservation = screeningEventReservations.data
                    .filter((r) => r.reservationStatus === factory.chevre.reservationStatusType.ReservationConfirmed)
                    .find((r) => r.id === decodeResult.typeOfGood.id);
                const isAvailable = availableReservation !== undefined;
                const statusCode = OK;
                return new ConvertQrcodeToTokenSuccess({
                    token, decodeResult, availableReservation, checkTokenActions, isAvailable, statusCode
                });
            } catch (error) {
                return new ConvertQrcodeToTokenFail({ error });
            }
        })
    );

    /**
     * Admission
     */
    @Effect()
    public Admission = this.actions.pipe(
        ofType<Admission>(ActionTypes.Admission),
        map(action => action.payload),
        mergeMap(async (payload) => {
            // console.log(payload);
            try {
                await this.cinerino.getServices();
                this.cinerino.reservation.findScreeningEventReservationByToken(payload.params);
                return new AdmissionSuccess(payload.params);
            } catch (error) {
                return new AdmissionFail({ error: error });
            }
        })
    );
}