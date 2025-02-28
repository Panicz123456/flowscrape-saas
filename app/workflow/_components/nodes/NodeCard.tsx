import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";

export const NodeCard = ({
  children,
  nodeId,
  isSelected,
}: {
  nodeId: string;
  isSelected: boolean;
  children: React.ReactNode;
}) => {
  const { getNode, setCenter } = useReactFlow();

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { height, width } = measured;
        const x = position.x + width! / 2;
        const y = position.x + height! / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, {
          zoom: 1,
          duration: 300,
        });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] test-xs gap-1 flex flex-col",
        isSelected && "border-primary"
      )}>
      {children}
    </div>
  );
};
