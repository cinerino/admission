import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-complete',
    templateUrl: './purchase-complete.component.html',
    styleUrls: ['./purchase-complete.component.scss']
})
export class PurchaseCompleteComponent implements OnInit, OnDestroy {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public error: Observable<string | null>;
    public moment: typeof moment = moment;
    public eventOrders: Functions.Purchase.IEventOrder[];
    public environment = getEnvironment();
    public qrcode?: string;
    public paymentMethodType = factory.chevre.paymentMethodType;
    public getCustomPaymentMethodTypeName = Functions.Purchase.getCustomPaymentMethodTypeName;
    public connectionType = Models.Util.Printer.ConnectionType;
    public createOrderLink = Functions.Order.createOrderLink;
    private timer: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private actionService: ActionService,
    ) { }

    public async ngOnInit() {
        this.eventOrders = [];
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        let order: factory.order.IOrder;
        try {
            const purchaseData = await this.actionService.purchase.getData();
            if (purchaseData.order === undefined) {
                throw new Error('order not found').message;
            }
            order = purchaseData.order;
            this.eventOrders = Functions.Purchase.order2EventOrders({ order });
            await this.print();
        } catch (error) {
            this.router.navigate(['/stop']);
            return;
        }
        if (this.environment.PRINT_SUCCESS_WAIT_TIME === '') {
            return;
        }
        const time = Number(this.environment.PRINT_SUCCESS_WAIT_TIME);
        this.timer = setTimeout(() => {
            this.router.navigate(['/']);
        }, time);
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        if (this.timer !== undefined) {
            clearTimeout(this.timer);
        }
    }


    /**
     * 印刷
     */
    public async print() {
        const purchase = await this.actionService.purchase.getData();
        const user = await this.actionService.user.getData();
        if (purchase.order === undefined
            || user.printer === undefined) {
            throw new Error('printer undefined');
        }
        const orders = [purchase.order];
        const pos = user.pos;
        const printer = user.printer;
        await this.actionService.order.print({ orders, pos, printer });
    }

}
