import { Card, CardHeader, CardTitle, CardContent } from "./card";

const TitledCard = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className="flex w-full flex-col justify-center">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent
      className={`flex h-[30vh] w-full flex-col items-center justify-center ${className}`}
    >
      {children}
    </CardContent>
  </Card>
);

export default TitledCard;
