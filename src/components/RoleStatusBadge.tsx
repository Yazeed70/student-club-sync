
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Clock, X } from 'lucide-react';

type StatusType = 'approved' | 'pending' | 'rejected';

interface RoleStatusBadgeProps {
  status: StatusType;
  type?: 'club' | 'event' | 'role';
  showIcon?: boolean;
}

const RoleStatusBadge: React.FC<RoleStatusBadgeProps> = ({
  status,
  type = 'club',
  showIcon = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          variant: 'success' as const,
          icon: <Check className="h-3 w-3" />,
          label: 'Approved',
          description: `This ${type} has been approved`
        };
      case 'pending':
        return {
          variant: 'warning' as const,
          icon: <Clock className="h-3 w-3" />,
          label: 'Pending',
          description: `This ${type} is awaiting approval`
        };
      case 'rejected':
        return {
          variant: 'destructive' as const,
          icon: <X className="h-3 w-3" />,
          label: 'Rejected',
          description: `This ${type} has been rejected`
        };
      default:
        return {
          variant: 'outline' as const,
          icon: null,
          label: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  const { variant, icon, label, description } = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="gap-1">
            {showIcon && icon}
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RoleStatusBadge;
