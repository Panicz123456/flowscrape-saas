"use client";
import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import React, { Fragment } from "react";

export const DeletableEdge = (props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);

  const { setEdges } = useReactFlow();

  return (
    <Fragment>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
Deletable edges
        </div>
      </EdgeLabelRenderer>
    </Fragment>
  );
}

export default DeletableEdge;