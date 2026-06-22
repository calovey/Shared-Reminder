import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from '../../layout/components/language-switcher/language-switcher';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LanguageSwitcherComponent],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss',
})
export class AuthShellComponent { }
