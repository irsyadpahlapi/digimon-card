export interface StarterPackProps {
  item: {
    id: number;
    name: string;
    type: string;
    image: string;
    price: number;
    description: string;
  };
}

export interface StarterPackComponentProps {
  readonly item: StarterPackProps['item'];
  readonly onBuy?: (item: StarterPackProps['item']) => void;
  readonly isLoading?: boolean;
}
