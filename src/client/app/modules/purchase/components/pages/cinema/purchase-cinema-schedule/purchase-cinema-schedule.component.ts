import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { BsDatepickerContainerComponent, BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { Functions } from '../../../../../..';
import { getEnvironment } from '../../../../../../../environments/environment';
import { MasterService, PurchaseService, UserService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-schedule',
    templateUrl: './purchase-cinema-schedule.component.html',
    styleUrls: ['./purchase-cinema-schedule.component.scss']
})
export class PurchaseCinemaScheduleComponent implements OnInit, OnDestroy {
    public purchase: Observable<reducers.IPurchaseState>;
    public error: Observable<string | null>;
    public master: Observable<reducers.IMasterState>;
    public user: Observable<reducers.IUserState>;
    public screeningWorkEvents: Functions.Purchase.IScreeningEventWork[];
    public moment = moment;
    public scheduleDate: Date;
    public environment = getEnvironment();
    private updateTimer: any;
    @ViewChild('datepicker', { static: true }) private datepicker: BsDatepickerDirective;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private translate: TranslateService,
        private userService: UserService,
        private masterService: MasterService,
        private purchaseService: PurchaseService,
        private localeService: BsLocaleService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.user = this.store.pipe(select(reducers.getUser));
        this.screeningWorkEvents = [];
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        clearTimeout(this.updateTimer);
    }

    /**
     * 更新
     */
    private update() {
        if (this.updateTimer !== undefined) {
            clearTimeout(this.updateTimer);
        }
        const time = 600000; // 10 * 60 * 1000
        this.updateTimer = setTimeout(() => {
            this.selectDate();
        }, time);
    }

    /**
     * 日付選択
     */
    public async selectDate(date?: Date | null) {
        if (date !== undefined && date !== null) {
            this.scheduleDate = date;
        }
        const user = await this.userService.getData();
        const theater = user.theater;
        if (this.scheduleDate === undefined) {
            this.scheduleDate = moment()
                .add(this.environment.PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE, 'day')
                .toDate();
        }
        const scheduleDate = moment(this.scheduleDate).format('YYYY-MM-DD');
        if (theater === undefined) {
            return;
        }
        this.purchaseService.selectScheduleDate(scheduleDate);
        try {
            const screeningEvents = await this.masterService.getSchedule({
                superEvent: { locationBranchCodes: [theater.branchCode] },
                startFrom: moment(scheduleDate).toDate(),
                startThrough: moment(scheduleDate).add(1, 'day').toDate()
            });
            this.screeningWorkEvents = Functions.Purchase.screeningEvents2WorkEvents({ screeningEvents });
            this.update();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * スケジュール選択
     */
    public async selectSchedule(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        if (screeningEvent.remainingAttendeeCapacity === undefined
            || screeningEvent.remainingAttendeeCapacity === 0) {
            return;
        }
        if (screeningEvent.offers === undefined
            || screeningEvent.offers.itemOffered.serviceOutput === undefined
            || screeningEvent.offers.itemOffered.serviceOutput.reservedTicket === undefined
            || screeningEvent.offers.itemOffered.serviceOutput.reservedTicket.ticketedSeat === undefined) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.cinema.schedule.alert.ticketedSeat')
            });
            return;
        }
        this.purchaseService.unsettledDelete();
        try {
            await this.purchaseService.getScreeningEvent(screeningEvent);
            if (screeningEvent.offers.seller === undefined
                || screeningEvent.offers.seller.id === undefined) {
                throw new Error('screeningEvent.offers.seller or screeningEvent.offers.seller.id undefined');
            }
            await this.purchaseService.getSeller(screeningEvent.offers.seller.id);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
            return;
        }
        const purchase = await this.purchaseService.getData();
        const user = await this.userService.getData();
        if (purchase.seller === undefined) {
            this.router.navigate(['/error']);
            return;
        }

        if (purchase.authorizeSeatReservations.length > 0) {
            try {
                await this.purchaseService.cancelTemporaryReservations(purchase.authorizeSeatReservations);
            } catch (error) {
                console.error(error);
                this.router.navigate(['/error']);
                return;
            }
        }
        try {
            await this.purchaseService.startTransaction({
                seller: purchase.seller,
                pos: user.pos
            });
            this.router.navigate(['/purchase/cinema/seat']);
        } catch (error) {
            console.error(error);
            const errorObject = JSON.parse(error);
            if (errorObject.status === TOO_MANY_REQUESTS) {
                this.router.navigate(['/congestion']);
                return;
            }
            if (errorObject.status === BAD_REQUEST) {
                this.router.navigate(['/maintenance']);
                return;
            }
            this.router.navigate(['/error']);
        }
    }

    /**
     * Datepicker言語設定
     */
    public setDatePicker() {
        this.user.subscribe((user) => {
            this.localeService.use(user.language);
        }).unsubscribe();
    }

    /**
     * Datepicker開閉
     */
    public toggleDatepicker() {
        this.setDatePicker();
        this.datepicker.toggle();
    }

    /**
     * iOS bugfix（2回タップしないと選択できない）
     */
    public onShowPicker(container: BsDatepickerContainerComponent) {
        Functions.Util.iOSDatepickerTapBugFix(container, [
            this.datepicker
        ]);
    }

}