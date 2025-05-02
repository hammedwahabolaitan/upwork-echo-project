
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/utils/toastUtils";

const PaymentSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment methods and billing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-center">
            Connect your payment methods to receive payments or pay for services
          </p>
        </div>
        
        <Button onClick={() => toast("Feature coming soon", { description: "Payment integration will be available soon" })}>
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
