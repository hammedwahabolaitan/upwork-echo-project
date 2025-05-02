
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/utils/toastUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, CreditCardIcon, CircleDollarSign } from "lucide-react";

const PaymentSettings = () => {
  const [activeTab, setActiveTab] = useState("cards");
  
  const handleAddPaymentMethod = (type: string) => {
    toast(`Adding ${type} payment method`, { 
      description: `${type} integration will be available soon` 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment methods and billing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full md:w-auto">
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Credit Cards</span>
            </TabsTrigger>
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4" />
              <span>PayPal</span>
            </TabsTrigger>
            <TabsTrigger value="others" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Other Methods</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards">
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
                <p className="text-center text-gray-500 mb-2">You have no credit cards connected</p>
                <div className="flex justify-center">
                  <CreditCardIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => handleAddPaymentMethod("Credit Card")}
                  className="flex-1"
                >
                  Add Credit Card
                </Button>
                <Button 
                  onClick={() => handleAddPaymentMethod("Debit Card")} 
                  variant="outline"
                  className="flex-1"
                >
                  Add Debit Card
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paypal">
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
                <p className="text-center text-gray-500 mb-2">Connect your PayPal account to make and receive payments</p>
                <div className="flex justify-center">
                  <CircleDollarSign className="h-12 w-12 text-blue-500" />
                </div>
              </div>
              
              <Button 
                onClick={() => handleAddPaymentMethod("PayPal")}
                className="w-full sm:w-auto"
              >
                Connect PayPal Account
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="others">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleAddPaymentMethod("Bank Transfer")}>
                <h3 className="font-medium mb-2">US Bank Account</h3>
                <p className="text-sm text-gray-500">Connect your US bank account for direct deposits and payments</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleAddPaymentMethod("Paystack")}>
                <h3 className="font-medium mb-2">Paystack</h3>
                <p className="text-sm text-gray-500">Popular payment method in Africa with support for local currencies</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleAddPaymentMethod("Pioneer")}>
                <h3 className="font-medium mb-2">Pioneer</h3>
                <p className="text-sm text-gray-500">Global payment service with competitive exchange rates</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleAddPaymentMethod("Wire Transfer")}>
                <h3 className="font-medium mb-2">International Wire</h3>
                <p className="text-sm text-gray-500">International wire transfer for larger payments</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium mb-4">Payment History</h3>
          <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
            No payment history available
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
