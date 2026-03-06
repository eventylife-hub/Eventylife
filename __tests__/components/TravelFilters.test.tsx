import React from 'react';
import { render, screen, userEvent } from '@/__tests__/test-utils';
import { TravelFilters } from '@/components/TravelFilters';

describe('Composant TravelFilters', () => {
  const mockOnDestinationChange = jest.fn();
  const mockOnMinPriceChange = jest.fn();
  const mockOnMaxPriceChange = jest.fn();
  const mockOnSortChange = jest.fn();

  const defaultProps = {
    destination: '',
    onDestinationChange: mockOnDestinationChange,
    minPrice: null,
    onMinPriceChange: mockOnMinPriceChange,
    maxPrice: null,
    onMaxPriceChange: mockOnMaxPriceChange,
    sortBy: 'popular',
    onSortChange: mockOnSortChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Affiche le titre des filtres', () => {
    render(<TravelFilters {...defaultProps} />);
    expect(screen.getByText('Filtres')).toBeInTheDocument();
  });

  test('Affiche le champ destination', () => {
    render(<TravelFilters {...defaultProps} />);
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
  });

  test('Affiche le champ prix minimum', () => {
    render(<TravelFilters {...defaultProps} />);
    expect(screen.getByLabelText(/Prix minimum/)).toBeInTheDocument();
  });

  test('Affiche le champ prix maximum', () => {
    render(<TravelFilters {...defaultProps} />);
    expect(screen.getByLabelText(/Prix maximum/)).toBeInTheDocument();
  });

  test('Affiche le menu déroulant de tri', () => {
    render(<TravelFilters {...defaultProps} />);
    expect(screen.getByLabelText('Trier par')).toBeInTheDocument();
  });

  test('Les options de tri sont présentes', () => {
    render(<TravelFilters {...defaultProps} />);
    expect(screen.getByText('Plus populaires')).toBeInTheDocument();
    expect(screen.getByText('Prix croissant')).toBeInTheDocument();
    expect(screen.getByText('Prix décroissant')).toBeInTheDocument();
    expect(screen.getByText('Meilleure notation')).toBeInTheDocument();
  });

  test('Modifie la destination au changement du champ', async () => {
    render(<TravelFilters {...defaultProps} />);
    const input = screen.getByPlaceholderText('Chercher...') as HTMLInputElement;
    
    await userEvent.type(input, 'Paris');
    
    expect(mockOnDestinationChange).toHaveBeenCalledWith('Paris');
  });

  test('Affiche la destination saisie', () => {
    const props = {
      ...defaultProps,
      destination: 'Nice',
    };
    render(<TravelFilters {...props} />);
    expect(screen.getByPlaceholderText('Chercher...')).toHaveValue('Nice');
  });

  test('Met à jour le prix minimum correctement', async () => {
    render(<TravelFilters {...defaultProps} />);
    const minPriceInput = screen.getByPlaceholderText('0') as HTMLInputElement;
    
    await userEvent.type(minPriceInput, '500');
    
    expect(mockOnMinPriceChange).toHaveBeenCalledWith(50000);
  });

  test('Convertit le prix minimum en centimes', async () => {
    render(<TravelFilters {...defaultProps} />);
    const minPriceInput = screen.getByPlaceholderText('0') as HTMLInputElement;
    
    await userEvent.type(minPriceInput, '1000');
    
    expect(mockOnMinPriceChange).toHaveBeenCalledWith(100000);
  });

  test('Affiche le prix minimum converti en euros', () => {
    const props = {
      ...defaultProps,
      minPrice: 50000,
    };
    render(<TravelFilters {...props} />);
    expect(screen.getByPlaceholderText('0')).toHaveValue(500);
  });

  test('Met à jour le prix maximum correctement', async () => {
    render(<TravelFilters {...defaultProps} />);
    const maxPriceInput = screen.getByPlaceholderText('10000') as HTMLInputElement;
    
    await userEvent.type(maxPriceInput, '2000');
    
    expect(mockOnMaxPriceChange).toHaveBeenCalledWith(200000);
  });

  test('Affiche le prix maximum converti en euros', () => {
    const props = {
      ...defaultProps,
      maxPrice: 500000,
    };
    render(<TravelFilters {...props} />);
    expect(screen.getByPlaceholderText('10000')).toHaveValue(5000);
  });

  test('Sélectionne l\'option de tri populaire par défaut', () => {
    render(<TravelFilters {...defaultProps} />);
    expect(screen.getByDisplayValue('popular')).toBeInTheDocument();
  });

  test('Change l\'option de tri au changement du menu', async () => {
    render(<TravelFilters {...defaultProps} />);
    const selectElement = screen.getByDisplayValue('popular') as HTMLSelectElement;

    await userEvent.selectOptions(selectElement, 'price-asc');

    expect(mockOnSortChange).toHaveBeenCalledWith('price-asc');
  });

  test('Affiche l\'option de tri sélectionnée', () => {
    const props = {
      ...defaultProps,
      sortBy: 'price-desc',
    };
    render(<TravelFilters {...props} />);
    expect(screen.getByDisplayValue('price-desc')).toBeInTheDocument();
  });

  test('Appellle le callback destination avec chaîne vide', async () => {
    const props = {
      ...defaultProps,
      destination: 'Paris',
    };
    render(<TravelFilters {...props} />);
    const input = screen.getByPlaceholderText('Chercher...') as HTMLInputElement;
    
    await userEvent.clear(input);
    
    expect(mockOnDestinationChange).toHaveBeenCalled();
  });

  test('Gère correctement les prix null', () => {
    const props = {
      ...defaultProps,
      minPrice: null,
      maxPrice: null,
    };
    render(<TravelFilters {...props} />);
    expect(screen.getByPlaceholderText('0')).toHaveValue(null);
    expect(screen.getByPlaceholderText('10000')).toHaveValue(null);
  });

  test('Met à jour le prix minimum à null quand vide', async () => {
    const props = {
      ...defaultProps,
      minPrice: 50000,
    };
    render(<TravelFilters {...props} />);
    const minPriceInput = screen.getByPlaceholderText('0') as HTMLInputElement;
    
    await userEvent.clear(minPriceInput);
    
    expect(mockOnMinPriceChange).toHaveBeenCalledWith(null);
  });

  test('Met à jour le prix maximum à null quand vide', async () => {
    const props = {
      ...defaultProps,
      maxPrice: 500000,
    };
    render(<TravelFilters {...props} />);
    const maxPriceInput = screen.getByPlaceholderText('10000') as HTMLInputElement;
    
    await userEvent.clear(maxPriceInput);
    
    expect(mockOnMaxPriceChange).toHaveBeenCalledWith(null);
  });

  test('Les champs destination sont indépendants', async () => {
    const mockChangeDest = jest.fn();
    const mockChangeMin = jest.fn();
    const props = {
      ...defaultProps,
      onDestinationChange: mockChangeDest,
      onMinPriceChange: mockChangeMin,
    };
    
    render(<TravelFilters {...props} />);
    const destInput = screen.getByPlaceholderText('Chercher...');
    const minInput = screen.getByPlaceholderText('0');
    
    await userEvent.type(destInput, 'Nice');
    
    expect(mockChangeDest).toHaveBeenCalled();
    expect(mockChangeMin).not.toHaveBeenCalled();
  });

  test('Affiche les champs sur une grille responsive', () => {
    const { container } = render(<TravelFilters {...defaultProps} />);
    const gridDiv = container.querySelector('.grid');
    expect(gridDiv).toBeInTheDocument();
    expect(gridDiv).toHaveClass('md:grid-cols-3');
  });
});
