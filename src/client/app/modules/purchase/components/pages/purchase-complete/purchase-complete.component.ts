import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { EpsonEPOSService, OrderService, PurchaseService, UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-complete',
    templateUrl: './purchase-complete.component.html',
    styleUrls: ['./purchase-complete.component.scss']
})
export class PurchaseCompleteComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public error: Observable<string | null>;
    public moment: typeof moment = moment;
    public eventOrders: Functions.Purchase.IEventOrder[];
    public environment = getEnvironment();
    public qrcode?: string;
    public paymentMethodType = factory.paymentMethodType;
    public getCustomPaymentMethodTypeName = Functions.Purchase.getCustomPaymentMethodTypeName;
    public connectionType = Models.Util.Printer.ConnectionType;
    public createOrderLink = Functions.Order.createOrderLink;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private purchaseService: PurchaseService,
        private orderService: OrderService,
        private userService: UserService,
        private utilService: UtilService,
        private translate: TranslateService,
        private epsonEPOSService: EpsonEPOSService,
    ) { }

    public async ngOnInit() {
        this.eventOrders = [];
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        let order: factory.order.IOrder;
        try {
            const purchaseData = await this.purchaseService.getData();
            if (purchaseData.order === undefined) {
                throw new Error('order not found').message;
            }
            order = purchaseData.order;
            this.eventOrders = Functions.Purchase.order2EventOrders({ order });
            this.print();
        } catch (error) {
            this.router.navigate(['/error']);
            return;
        }
    }

    /**
     * 印刷
     */
    public async print() {
        try {
            const purchase = await this.purchaseService.getData();
            const user = await this.userService.getData();
            if (purchase.order === undefined
                || user.printer === undefined) {
                throw new Error('printer undefined');
            }
            const orders = [purchase.order];
            const pos = user.pos;
            const printer = user.printer;
            await this.orderService.print({ orders, pos, printer });
        } catch (error) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: `
                <p class="mb-4">${this.translate.instant('purchase.complete.alert.print')}</p>
                    <div class="p-3 bg-light-gray select-text">
                    <code>${error}</code>
                </div>`
            });
        }
    }

    public async test() {
        try {
            // デモ用
            const purchase = await this.purchaseService.getData();
            if (purchase.order?.paymentMethods.find(p => p.typeOf === this.paymentMethodType.Cash) !== undefined) {
                // 現金
                const paymentMethod = purchase.order?.paymentMethods.find(p => p.typeOf === this.paymentMethodType.Cash);
                if (paymentMethod === undefined
                    || paymentMethod.totalPaymentDue?.value === undefined) {
                    return;
                }
                const user = await this.userService.getData();
                if (user.payment === undefined) {
                    throw new Error('payment undefined');
                }
                await this.epsonEPOSService.cashchanger.init({ payment: user.payment });
                await this.epsonEPOSService.cashchanger.dispenseChange({ amount: paymentMethod.totalPaymentDue.value });
                await this.epsonEPOSService.cashchanger.disconnect();
            }
        } catch (error) {
            console.error(error);
        }
    }

}